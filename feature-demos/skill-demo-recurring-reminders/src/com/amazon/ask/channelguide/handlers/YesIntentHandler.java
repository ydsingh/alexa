package com.amazon.ask.channelguide.handlers;

import com.amazon.ask.channelguide.model.Show;
import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import com.amazon.ask.model.services.ServiceException;
import com.amazon.ask.model.services.reminderManagement.AlertInfo;
import com.amazon.ask.model.services.reminderManagement.AlertInfoSpokenInfo;
import com.amazon.ask.model.services.reminderManagement.PushNotification;
import com.amazon.ask.model.services.reminderManagement.PushNotificationStatus;
import com.amazon.ask.model.services.reminderManagement.Recurrence;
import com.amazon.ask.model.services.reminderManagement.RecurrenceFreq;
import com.amazon.ask.model.services.reminderManagement.ReminderRequest;
import com.amazon.ask.model.services.reminderManagement.ReminderResponse;
import com.amazon.ask.model.services.reminderManagement.SpokenText;
import com.amazon.ask.model.services.reminderManagement.Trigger;
import com.amazon.ask.model.services.reminderManagement.TriggerType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;

import static com.amazon.ask.channelguide.model.Constants.PREVIOUS_INTENT_KEY;
import static com.amazon.ask.channelguide.model.Constants.REMINDERS_PERMISSION;
import static com.amazon.ask.channelguide.model.Constants.SHOW_KEY;
import static com.amazon.ask.channelguide.model.Constants.WHEN_IS_MY_SHOW_INTENT;
import static com.amazon.ask.channelguide.model.Constants.YES_INTENT;
import static com.amazon.ask.request.Predicates.intentName;

public class YesIntentHandler implements RequestHandler {

    private static final Logger log = LoggerFactory.getLogger(YesIntentHandler.class);

    @Override
    public boolean canHandle(HandlerInput input) {
        return input.matches(intentName(YES_INTENT));
    }

    @Override
    public Optional<Response> handle(HandlerInput input) {

        String previousIntent = (String) input.getAttributesManager().getSessionAttributes().get(PREVIOUS_INTENT_KEY);

        if (previousIntent != null &&previousIntent.equals(WHEN_IS_MY_SHOW_INTENT)) {
            final ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            Show show = mapper.convertValue(input.getAttributesManager().getSessionAttributes().get(SHOW_KEY), Show.class);

            try {
                ReminderResponse response = createReminderForShow(input, show);

                String speechText = String.format("Reminder for %s set", show.getName());

                return input.getResponseBuilder()
                        .withSimpleCard("Channel Guide", speechText)
                        .withSpeech(speechText)
                        .withShouldEndSession(true)
                        .build();
            } catch (ServiceException e) {
                log.error("Error creating reminder", e);
                if(e.getStatusCode() == 401) {
                    return input.getResponseBuilder()
                            .withSpeech("Please enable Reminder permissions in the Amazon Alexa app using the card I\'ve sent to your Alexa app.")
                            .withAskForPermissionsConsentCard(Arrays.asList(REMINDERS_PERMISSION))
                            .withShouldEndSession(true)
                            .build();
                } else if (e.getStatusCode() == 403) {
                    return input.getResponseBuilder()
                            .withSpeech("Sorry, this device doesn\'t support reminders.")
                            .withShouldEndSession(true)
                            .build();
                } else {
                    return input.getResponseBuilder()
                            .withSpeech("There was an error when setting the reminder.")
                            .withShouldEndSession(true)
                            .build();
                }
            }
        }
        else {
            return input.getResponseBuilder()
                    .withSpeech("Hmm. I'm not sure how to help you with that. This skill can set reminders for when shows will be on TV. What show did you want to know about?")
                    .withShouldEndSession(false)
                    .build();
        }
    }

    private ReminderResponse createReminderForShow(HandlerInput input, Show show) {
        String reminderLabel = String.format("It's time for %s", show.getName());

        SpokenText spokenText = SpokenText.builder()
                .withText(reminderLabel)
                .withLocale("en-US")
                .build();

        AlertInfoSpokenInfo alertInfoSpokenInfo = AlertInfoSpokenInfo.builder()
                .addContentItem(spokenText)
                .build();

        AlertInfo alertInfo = AlertInfo.builder()
                .withSpokenInfo(alertInfoSpokenInfo)
                .build();

        // For recurring reminders, the trigger date can be set to now() with the time component set to the trigger
        // time. The reminder will automatically trigger at the trigger time at the next occurrence based on the
        // recurrence pattern.
        LocalDateTime triggerTime = LocalDateTime.of(LocalDate.now(), show.getShowTime().getLocalTime());

        Recurrence recurrence = Recurrence.builder()
                .withByDay(show.getShowTime().getRecurrenceDays())
                .withFreq(RecurrenceFreq.WEEKLY)
                .build();

        Trigger trigger = Trigger.builder()
                .withType(TriggerType.SCHEDULED_ABSOLUTE)
                .withScheduledTime(triggerTime)
                .withRecurrence(recurrence)
                .withTimeZoneId("America/Los_Angeles")
                .build();

        PushNotification pushNotification = PushNotification.builder()
                .withStatus(PushNotificationStatus.ENABLED)
                .build();

        ReminderRequest reminderRequest = ReminderRequest.builder()
                .withAlertInfo(alertInfo)
                .withRequestTime(OffsetDateTime.now())
                .withTrigger(trigger)
                .withPushNotification(pushNotification)
                .build();

        return input.getServiceClientFactory().getReminderManagementService().createReminder(reminderRequest);
    }
}
